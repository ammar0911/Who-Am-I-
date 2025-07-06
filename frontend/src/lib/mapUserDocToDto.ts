import { UserDoc, UserDTO } from '@/types';

function mapUserDocToDTO(user: UserDoc): UserDTO {
  return {
    id: user.id,
    accountType: user.account_type || 'Guest',
    email: user.email,
    name: user.name,
    officeId: user.office_id?.id || null,
    pronouns: user.pronouns || null,
    userSettings: user.user_settings || '{}',
    avatar: user.avatar || '',
    title: user.title || '',
    department: user.department || '',
    isPublic: user.is_public || false,
    available: 'Private',
  };
}

export default mapUserDocToDTO;
