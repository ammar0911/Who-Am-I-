import { OfficeDTO, UserDoc, UserDTO } from '@/types';

interface ExtraUserFields {
  office?: OfficeDTO | null;
}

function mapUserDocToDTO(
  user: UserDoc,
  extraFields?: ExtraUserFields,
): UserDTO {
  const { office } = extraFields || {};
  return {
    id: user.id,
    accountType: user.account_type || 'Guest',
    email: user.email,
    name: user.name,
    officeId: user.office_id?.id || null,
    office: office || null,
    pronouns: user.pronouns || null,
    userSettings: user.user_settings || '{}',
    avatar: user.avatar || '',
    title: user.title || '',
    department: user.department || '',
    isPublic: user.is_public || false,
    available: user.available || 'Private',
  };
}

export default mapUserDocToDTO;
