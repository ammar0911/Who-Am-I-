interface UserAvatarProps {
  userAvatar?: string;
  userName: string;
  width: number;
  height: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  userAvatar,
  userName,
  width,
  height,
}) => {
  if (!userAvatar) {
    return (
      <div className="avatar avatar-placeholder">
        <div
          className={`bg-base-content text-base-100 w-[${width}px] rounded-full`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <span className="text-xl">
            {userName.substring(0, 1).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      width={width}
      height={height}
      src={userAvatar}
      className="rounded-full"
      aria-hidden
    />
  );
};

export default UserAvatar;
