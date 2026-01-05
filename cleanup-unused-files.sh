#!/bin/bash
# Client cleanup - Delete unused files
# Generated: 2026-01-02
# 
# IMPORTANT: Review this list before running!
# Test the app after deletion to ensure nothing breaks.

echo "=== Client Cleanup Script ==="
echo "Creating backup..."

# Create backup with timestamp
BACKUP_DIR="client/src.backup.$(date +%Y%m%d_%H%M%S)"
cp -r client/src "$BACKUP_DIR"
echo "Backup created: $BACKUP_DIR"

echo ""
echo "Deleting unused component files..."

# Delete unused component root files
rm -f client/src/components/class-moderator-header.tsx
rm -f client/src/components/hr-assistant-header.tsx
rm -f client/src/components/hr-assistant-sidebar.tsx
rm -f client/src/components/teacher-header.tsx
rm -f client/src/components/teacher-sidebar.tsx

# Delete unused dashboard components
rm -f client/src/components/dashboards/hr-assistant-attendance.tsx
rm -f client/src/components/dashboards/hr-assistant-dashboard-home.tsx
rm -f client/src/components/dashboards/hr-assistant-leave-management.tsx
rm -f client/src/components/dashboards/hr-assistant-staff-directory.tsx
rm -f client/src/components/dashboards/teacher-attendance.tsx
rm -f client/src/components/dashboards/teacher-dashboard-home.tsx
rm -f client/src/components/dashboards/teacher-leave-requests.tsx
rm -f client/src/components/dashboards/teacher-schedule.tsx

echo ""
echo "=== Cleanup Summary ==="
echo "Files deleted: 13"
echo "  - Component root: 5 files"
echo "  - Dashboards: 8 files"
echo ""
echo "NEXT STEPS:"
echo "1. Test the application: npm run dev"
echo "2. Check for TypeScript errors: npm run build"
echo "3. If issues occur, restore from: $BACKUP_DIR"
echo ""
echo "Cleanup complete!"
