import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface SummaryStats {
    totalFamilies: bigint;
    totalFoodTypes: bigint;
    totalAttendees: bigint;
    largestFamilyName: string;
    largestFamilySize: bigint;
}
export interface FamilyRaya {
    familyName: string;
    members: Array<string>;
    createdAt: Time;
    platter: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFamily(family: FamilyRaya): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteFamily(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFamilies(): Promise<Array<FamilyRaya>>;
    getFamily(id: string): Promise<FamilyRaya>;
    getFamilyCount(): Promise<bigint>;
    getFoodBreakdown(): Promise<Array<[string, bigint]>>;
    getLargestFamily(): Promise<{
        name: string;
        size: bigint;
    } | null>;
    getMemberCount(): Promise<bigint>;
    getSummaryStats(): Promise<SummaryStats>;
    getUniqueFoodTypesCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    resetFamilies(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateFamily(id: string, updatedFamily: FamilyRaya): Promise<void>;
}
