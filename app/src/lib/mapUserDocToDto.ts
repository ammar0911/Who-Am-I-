import { UserDoc, UserDTO } from '@/types';

function mapUserDocToDTO(user: UserDoc): UserDTO {
  return {
    id: user.id,
    accountType: user.account_type,
    email: user.email,
    name: user.name,
    officeId: user.office_id.id,
    password: user.password,
    pronouns: user.pronouns,
    userSettings: user.user_settings,
  };
}

export default mapUserDocToDTO;
