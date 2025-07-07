import Link from 'next/link';
import UserAvatar from './UserAvatar';
import { AvailabilityChip } from './AvailabilityChip';

import { UserDTO } from '@/types';
import React from 'react';

interface UserCardProps {
  user: UserDTO;
  hasDarkBackground?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  hasDarkBackground = false,
}) => {
  return (
    <Link
      key={user.id}
      href={`/profile/${user.id}`}
      className={`
        cursor-pointer backdrop-blur-sm rounded-lg px-6 py-5 transition-all duration-300  
        ${
          hasDarkBackground
            ? 'bg-white/5 hover:bg-white/10 border-white/10 border'
            : 'bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow'
        }
      `}
    >
      <div className="flex items-center space-x-4 mb-4">
        <UserAvatar
          width={48}
          height={48}
          userAvatar={user.avatar || ''}
          userName={user.name}
        />
        <div>
          <h3
            className={`text-lg font-semibold ${hasDarkBackground ? 'text-neutral-content' : 'text-base-content'}`}
          >
            {user.name}
          </h3>
          <p
            className={`text-sm ${hasDarkBackground ? 'text-neutral-content/70' : 'text-base-content'}`}
          >
            {user.title}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <AvailabilityChip
          status={user.available}
          isPublic={user.isPublic}
          isLoggedIn={false}
        />
      </div>
    </Link>
  );
};

export default UserCard;
