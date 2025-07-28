import { Route } from 'react-router-dom';
import Profile from "Pages/Profile/Profile";

export default function ProfileRoutes() {
  return (
    <>
      <Route path="/profile">
        <Route index element={<Profile />} />
        {/* <Route path=":id" element={<EditProfile />} /> */}
      </Route>
    </>
  );
}