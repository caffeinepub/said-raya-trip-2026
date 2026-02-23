# Specification

## Summary
**Goal:** Build a family event management application for SAID Raya Trip 2026 with registration forms, real-time statistics dashboard, and secure admin controls.

**Planned changes:**
- Implement minimal Raya-themed design system with soft cream background, emerald green primary color, and soft gold accents
- Create three-tab navigation: Daftar Keluarga (family registration), Summary Raya (statistics and visualizations), and Admin Dashboard (admin only)
- Build family registration form with dynamic member name fields that appear based on selected attendee count
- Store family data in backend family_raya table with nama_keluarga, makanan, ahli_keluarga array, and created_at timestamp
- Display animated statistics including total attendees counter, statistic cards (Total Orang, Total Keluarga, Total Jenis Makanan, Keluarga Paling Ramai), and family cards
- Add pie chart for food distribution and bar chart for attendees per family
- Implement secure admin authentication system with protected routes
- Build admin dashboard with editable data table, search/filter functionality, delete confirmation modals, and database reset capability
- Create Excel export feature generating three-sheet report: Raw Data (one row per member), Summary (statistics), and Makanan Breakdown (food distribution)
- Enable real-time data synchronization across all views without manual refresh

**User-visible outcome:** Families can register their attendance details through an elegant Raya-themed form. All users can view real-time statistics, charts, and family listings in the Summary tab. Authenticated admins can manage all registrations, export comprehensive Excel reports, and reset the database through a secure dashboard.
