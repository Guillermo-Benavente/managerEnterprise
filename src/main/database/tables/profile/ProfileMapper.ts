import MapperBase from '../MapperBase';
import ProfileData from "Types/main/database/ProfileData";
import ProfileType from "Types/main/database/ProfileType";
import PROFILE from 'renderer/schemas/ProfileSchema';

const ProfileMapper = new MapperBase<ProfileType, ProfileData>(PROFILE, {});

export default ProfileMapper;