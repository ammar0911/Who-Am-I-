import { AvailabilityStatus, OfficeDTO, UserDoc, UserDTO } from '@/types';

interface ExtraUserFields {
  office?: OfficeDTO | null;
}

function mapUserDocToDTO(
  user: UserDoc,
  extraFields?: ExtraUserFields,
): UserDTO {
  const { office } = extraFields || {};

  let available: AvailabilityStatus = 'Private';

  if (user.is_public) {
    available = user.available || 'Private';
  }

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
    available,
  };
}

export default mapUserDocToDTO;
