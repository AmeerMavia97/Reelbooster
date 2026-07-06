
"use client";
import { SetStateAction, useEffect, useRef } from "react";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { useNotifications } from "./useNotification";
import { groupNotificationByDate } from "./groupNotificationByDate";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { useRouter } from "next/navigation";
import { setUserId } from "@/app/store/Slice/UserIdHashtagIdSlice";
import { setSelectedReel } from "@/app/store/Slice/SelectedReelDetail";
import {
  setActiveCommentPostId,
  setActiveUserId,
} from "@/app/store/Slice/ActiveCommentBox";
import ReelDetailsModal from "@/app/explore/SelectedReelModal";
import { Reel } from "@/app/types/Reels";

function NotificationPopup() {
  const popupRef = useRef<HTMLDivElement>(null);
  const selectedReel = useAppSelector((state) => state.selectedReel.reel);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNotifications(10);

  // Flatten paginated notifications
  const notifications = data?.pages.flatMap((page) => page.Records) || [];

  // Group by Today / Yesterday / Other
  const grouped = groupNotificationByDate(
    notifications.map((n) => ({ ...n, created_at: n.createdAt }))
  );

  // RoutetoUser
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleUserRoute = (userId: number) => {
    dispatch(setUserId(userId));
    router.push(`/profile/${userId}`);
  };

  // Close popup when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedReel) return; // 👈 if modal is open, don’t close popup

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        dispatch(hideModal("Notification"));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch, selectedReel]);

  // Infinite scroll trigger
  useEffect(() => {
    const handleScroll = () => {
      if (!popupRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = popupRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    const container = popupRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div
        ref={popupRef}
        className="relative min-w-[350px] max-h-[500px] overflow-y-auto 
           bg-primary rounded-lg shadow-lg px-6 pt-6 pb-4 "

      >
        {/* Shimmer Loader while fetching first time */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div className="flex flex-col gap-2">
                  <div className="w-28 h-3 bg-gray-300 rounded" />

                  <div className="w-16 h-2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Notifications */}
        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Image
              src="/SidebarIcons/NoNotification.png"
              alt="No notifications"
              height={60}
              width={60}
            />
            <p className="text-gray text-sm mt-2">No notifications</p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && notifications.length > 0 && (
          <>
            {(["Today", "Yesterday"] as const).map(
              (section) =>
                grouped[section].length > 0 && (
                  <div key={section} className="mb-3">
                    <h4 className="text-sm font-semibold text-dark mb-1">
                      {section}
                    </h4>
                    {grouped[section].map((notif) => (
                      <div
                        key={notif.notification_id}
                        className="flex gap-3 py-2 cursor-pointer"
                      >
                        {(notif.notification_type?.includes("Liked") ||
                          notif.notification_type?.includes("Commented") ||
                          notif.notification_title?.includes("Liked") ||
                          notif.notification_title?.includes("Commented")) &&
                        notif.Social?.reel_thumbnail ? (
                          // Show reel thumbnail
                          <Image
                            src={notif.Social?.reel_thumbnail}
                            alt="reel"
                            className="w-10 h-10 object-cover rounded cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent parent click (user route)
                              dispatch(hideModal("Notification")); // 👈 close popup

                              dispatch(
                                setSelectedReel({
                                  ...notif.Social,
                                  // @ts-ignore
                                  User: notif.Social?.User,
                                })
                              );
                              
                              dispatch(
                                setActiveCommentPostId(notif.Social?.social_id ?? null)
                              );
                              dispatch(setActiveUserId(notif.Social?.user_id ?? null));
                            }}
                            width={40}
                            height={40}
                          />
                        ) : (
                          // Default to sender profile pic
                          <Image
                            src={
                              notif.notification_sender?.profile_pic ||
                              "/fallbacks/avatar.png"
                            }
                            width={40}
                            height={40}
                            alt="profile"
                            className="rounded-full"
                          />
                        )}

                        <div>
                          <p className="text-xs text-gray">
                            <span
                              className="font-semibold text-dark-gray cursor-pointer"
                              onClick={() => {
                                handleUserRoute(
                                  notif.notification_sender.user_id
                                );
                                dispatch(hideModal("Notification"));
                              }}
                            >
                              {notif.notification_sender?.user_name}
                            </span>{" "}
                            {notif.notification_description.description}
                          </p>
                          <p className="text-xs text-gray">
                            {new Date(notif.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )}

            {/* Other Dates */}
            {Object.entries(grouped.Other).map(([date, list]) => (
              <div key={date} className="mb-3">
                <h4 className="text-sm font-semibold text-dark mb-2">{date}</h4>
                {list.map((notif) => (
                  <div
                    key={notif.notification_id}
                    className="flex place-items-center gap-2 py-2 cursor-pointer"
                    onClick={() => {}}
                  >
                    {(notif.notification_type?.includes("Liked") ||
                      notif.notification_type?.includes("Commented") ||
                      notif.notification_title?.includes("Liked") ||
                      notif.notification_title?.includes("Commented")) &&
                    notif.Social?.reel_thumbnail ? (
                      // Show reel thumbnail
                      <Image
                        src={notif.Social?.reel_thumbnail}
                        alt="reel"
                        className="w-10 h-10 object-cover rounded cursor-pointer"
                        onClick={() => {
                          // Set reel in Redux (same as Explore)
                          dispatch(
                            setSelectedReel({
                              ...notif.Social,
                              // @ts-ignore
                              User:
                                notif.Social?.User || notif.notification_sender,
                                
                            })
                          );
                          

                          dispatch(
                            setActiveCommentPostId(notif?.Social?.social_id ?? null)
                          );
                          dispatch(
                            setActiveUserId(
                              notif.Social?.User?.user_id ||
                                notif.notification_sender?.user_id
                            )
                          );
                        }}
                        width={40}
                        height={40}
                      />
                    ) : (
                      // Default to sender profile pic
                      <Image
                        src={notif.notification_sender?.profile_pic}
                        width={40}
                        height={40}
                        alt="profile"
                        className="rounded-full"
                      />
                    )}

                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs text-dark-gray">
                        <span
                          className="text-dark text-xs cursor-pointer"
                          onClick={() => {
                            handleUserRoute(notif.notification_sender.user_id);
                            dispatch(hideModal("Notification"));
                          }}
                        >
                          {notif.notification_sender?.user_name}
                        </span>{" "}
                        {notif.notification_description.description}
                      </p>
                      <p className="text-[10px] text-gray">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* Footer messages */}
        {isFetchingNextPage && (
          <p className="text-center text-gray-500 text-sm py-2">
            <ClipLoader color="#1A9D77" size={15} />
          </p>
        )}
      </div>
      {selectedReel && <ReelDetailsModal setReels={function (value: SetStateAction<Reel[]>): void {
        throw new Error("Function not implemented.");
      } } />}
    </>
  );
}

export default NotificationPopup;
