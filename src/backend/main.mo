import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type FamilyRaya = {
    familyName : Text;
    platter : Text;
    members : [Text];
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  public type SummaryStats = {
    totalAttendees : Nat;
    totalFamilies : Nat;
    totalFoodTypes : Nat;
    largestFamilyName : Text;
    largestFamilySize : Nat;
  };

  module FamilyRaya {
    public func compareByMembersCount(a : FamilyRaya, b : FamilyRaya) : Order.Order {
      Nat.compare(a.members.size(), b.members.size());
    };
  };

  let families = Map.empty<Text, FamilyRaya>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Family management - Open to all users (including guests for registration)
  public shared ({ caller }) func addFamily(family : FamilyRaya) : async () {
    // Allow any user including guests to register families
    let id = family.familyName;
    let newFamily : FamilyRaya = {
      family with
      createdAt = Time.now();
    };
    families.add(id, newFamily);
  };

  public query ({ caller }) func getFamily(id : Text) : async FamilyRaya {
    // Public access - anyone can view a family
    switch (families.get(id)) {
      case (?family) { family };
      case (null) { Runtime.trap("Family not found") };
    };
  };

  public shared ({ caller }) func updateFamily(id : Text, updatedFamily : FamilyRaya) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update families");
    };
    let family = families.get(id);
    switch (family) {
      case (null) {
        Runtime.trap("Family not found");
      };
      case (?_) {
        families.add(
          id,
          {
            familyName = updatedFamily.familyName;
            platter = updatedFamily.platter;
            members = updatedFamily.members;
            createdAt = updatedFamily.createdAt;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteFamily(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete families");
    };

    if (not families.containsKey(id)) {
      Runtime.trap("Family not found");
    };
    families.remove(id);
  };

  public shared ({ caller }) func resetFamilies() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reset families");
    };
    families.clear();
  };

  // Queries and statistics - Public access for all users including guests
  public query ({ caller }) func getFamilies() : async [FamilyRaya] {
    // Public access - anyone can view families
    let allFamilies = List.empty<FamilyRaya>();
    for ((_, family) in families.entries()) {
      allFamilies.add(family);
    };
    allFamilies.toArray();
  };

  public query ({ caller }) func getFamilyCount() : async Nat {
    // Public access - anyone can view statistics
    families.size();
  };

  public query ({ caller }) func getMemberCount() : async Nat {
    // Public access - anyone can view statistics
    var count = 0;
    for ((id, family) in families.entries()) {
      let members = family.members;
      count += members.size();
    };
    count;
  };

  public query ({ caller }) func getUniqueFoodTypesCount() : async Nat {
    // Public access - anyone can view statistics
    let uniqueFoods = Map.empty<Text, Bool>();
    for ((_, family) in families.entries()) {
      uniqueFoods.add(family.platter, true);
    };
    uniqueFoods.size();
  };

  public query ({ caller }) func getLargestFamily() : async ?{ name : Text; size : Nat } {
    // Public access - anyone can view statistics
    var largestFamily : ?FamilyRaya = null;
    var maxSize = 0;

    for ((_, family) in families.entries()) {
      let size = family.members.size();
      if (size > maxSize) {
        maxSize := size;
        largestFamily := ?family;
      };
    };

    switch (largestFamily) {
      case (?family) {
        ?{ name = family.familyName; size = maxSize };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getSummaryStats() : async SummaryStats {
    // Public access - anyone can view statistics
    var totalAttendees = 0;
    var largestFamily : ?FamilyRaya = null;
    var maxSize = 0;
    let uniqueFoods = Map.empty<Text, Bool>();

    for ((_, family) in families.entries()) {
      let size = family.members.size();
      totalAttendees += size;

      uniqueFoods.add(family.platter, true);

      if (size > maxSize) {
        maxSize := size;
        largestFamily := ?family;
      };
    };

    let largestFamilyName = switch (largestFamily) {
      case (?family) { family.familyName };
      case (null) { "" };
    };

    {
      totalAttendees = totalAttendees;
      totalFamilies = families.size();
      totalFoodTypes = uniqueFoods.size();
      largestFamilyName = largestFamilyName;
      largestFamilySize = maxSize;
    };
  };

  public query ({ caller }) func getFoodBreakdown() : async [(Text, Nat)] {
    // Public access - anyone can view statistics
    let foodCount = Map.empty<Text, Nat>();

    for ((_, family) in families.entries()) {
      let currentCount = switch (foodCount.get(family.platter)) {
        case (?count) { count };
        case (null) { 0 };
      };
      foodCount.add(family.platter, currentCount + 1);
    };

    let breakdown = List.empty<(Text, Nat)>();
    for ((food, count) in foodCount.entries()) {
      breakdown.add((food, count));
    };
    breakdown.toArray();
  };
};
