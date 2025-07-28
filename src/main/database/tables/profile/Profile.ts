import ProfileData from 'Types/main/database/ProfileData';
import ProfileType from 'Types/main/database/ProfileType';
import ProfileMapper from './ProfileMapper';
import { IModel, ModelClass } from '../IModel';

const Profile: ModelClass<ProfileType, ProfileData> = 
class Profile implements IModel<ProfileType, ProfileData> {

  constructor(readonly data: ProfileData) {
    if (!data.nif)         throw new Error('El NIF es obligatorio');
    if (!data.name)       throw new Error('El nombre es obligatorio');
  }

  /** UI → dominio */
  static fromView(p: ProfileType): IModel<ProfileType, ProfileData> {
    if (!p.nif)        throw new Error('El NIF es obligatorio');
    if (!p.name)       throw new Error('El nombre es obligatorio');

    return new Profile(ProfileMapper.toData(p));
  }

  /** dominio → BD plano (strings ISO) */
  toData(): ProfileData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): ProfileType {
    return ProfileMapper.toFrontend(this.data);
  }
}

export default Profile;