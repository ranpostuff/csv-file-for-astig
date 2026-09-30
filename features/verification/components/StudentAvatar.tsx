import { UserRound } from "lucide-react";

type StudentAvatarProps = {
  firstName: string;
  lastName: string;
  profilePicture: string | null;
};

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function StudentAvatar({
  firstName,
  lastName,
  profilePicture,
}: StudentAvatarProps) {
  if (profilePicture) {
    return (
      <div className="h-36 w-36 overflow-hidden rounded-3xl border-4 border-white/70 bg-white shadow-xl">
        <img
          src={profilePicture}
          alt={`${firstName} ${lastName}`}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-36 w-36 flex-col items-center justify-center rounded-3xl border-4 border-white/50 bg-gradient-to-br from-rose-700 to-pink-600 text-white shadow-xl">
      <span className="text-4xl font-bold">
        {getInitials(firstName, lastName)}
      </span>

      <UserRound className="mt-1 h-5 w-5 opacity-70" />
    </div>
  );
}
