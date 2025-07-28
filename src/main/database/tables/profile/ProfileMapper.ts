import ProfileData from "Types/main/database/ProfileData";
import ProfileType from "Types/main/database/ProfileType";

export default class ProfileMapper {
  static toData(p: ProfileType): ProfileData {
    return {
      nif:                p.nif,
      name:              p.name,
      telephone:         p.telephone
    };
  }

  static toFrontend(data: ProfileData): ProfileType {
    return {
      nif:               data.nif,
      name:              data.name,
      telephone:         data.telephone
    };
  }
}