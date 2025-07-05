import { UserDoc, UserDTO } from '@/types';

function mapUserDocToDTO(user: UserDoc): UserDTO {
  return {
    id: user.id,
    accountType: user.account_type,
    email: user.email,
    name: user.name,
    officeId: user.office_id?.id,
    password: user.password,
    pronouns: user.pronouns,
    userSettings: user.user_settings,
    avatar: user.avatar || '', // Default to empty string if avatar is not provided
    title: user.title || '', // Default to empty string if title is not provided
    department: user.department || '', // Default to empty string if department is not provided
    isPublic: user.isPublic || false, // Default to false if is_public is not set
    available: 'Private', // Default to Private if not set
  };
}

export default mapUserDocToDTO;
