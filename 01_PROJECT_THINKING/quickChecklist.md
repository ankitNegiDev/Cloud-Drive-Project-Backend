
# Cloud Drive Project - Feature Checklist

## 🚀 MVP (Must-Have)

These are the essential features needed to have a working version of your Cloud Drive.

### Authentication

- **Signup**  
  Users can create an account using email and password.
- **Login**  
  Users can log in and receive a session token for protected routes.
- **Auth Middleware**  
  Protect routes by verifying the user’s token before allowing access.

### User

- **Get Profile**  
  Fetch basic user info such as email, user ID, and metadata.

### Files

- **Upload File**  
  Save files in Supabase Storage and store metadata in the database.
- **List Files**  
  Users can see only their own uploaded files.
- **Delete File**  
  Remove files from storage and database.
- **Download File**  
  Provide URL for file download (optional for MVP).

### Folders

- **Create Folder**  
  Organize files in folders.
- **List Folders**  
  Show folders belonging to the user.
- **Delete Folder**  
  Remove folders (and optionally, their contents).

### Sharing

- **Share File/Folder**  
  Allow sharing with other users by saving permissions in DB.
- **List Shared Items**  
  Users can see files/folders shared with them.

### Search

- **Search by Name**  
  Find files or folders by name.

---

## ✨ Nice-to-Have (Optional / Polishing Features)

These features will improve user experience but aren’t required for MVP.

### Authentication / Security

- **Reset Password**  
  Users can request a password reset link via email.
- **Update Password**  
  Logged-in users can change their password.
- **Email Verification Flow**  
  Fully integrate email confirmation in the frontend.

### User optional

- **Update Profile**  
  Add profile picture, name, or additional metadata.

### Files & Folders

- **Nested Folders**  
  Support folder hierarchy.
- **Rename / Move**  
  Allow users to rename files/folders and move them between folders.
- **File Preview**  
  Preview images, PDFs, or documents before downloading.

### Sharing optional

- **Advanced Permissions**  
  Set view/edit/owner access for shared files/folders.
- **Share via Link**  
  Generate public/private shareable links.

### Search optional

- **Advanced Search**  
  Search by metadata like date, type, or owner.
- **Full-Text Search**  
  Search contents of documents if stored in DB.

### Frontend / UX

- **Notifications**  
  Alert users when files are shared with them.
- **Activity Logs**  
  Track recent uploads, downloads, or edits.
- **Upload Progress & Loading States**  
  Improve feedback for users during file uploads.
