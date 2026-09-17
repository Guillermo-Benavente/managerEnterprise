import { Route } from 'react-router-dom';
import Profile from "Pages/Profile/Profile";
import ProfileDocument from 'Pages/Profile/ProfileDocument';
import ProfileCreateDocument from 'Pages/Profile/ProfileCreateDocument';
import ProfileEditDocument from 'Pages/Profile/ProfileEditDocument';

export default function ProfileRoutes() {
  return (
    <>
      <Route path="/profile">
        <Route index element={<Profile />} />
        <Route path=":id" element={<Profile />} />
        <Route path=":id/new" element={<ProfileCreateDocument />} />
        <Route path=":id/:documentId" element={<ProfileDocument />} />
        <Route path=":id/:documentId/edit" element={<ProfileEditDocument />} />
      </Route>
    </>
  );
}