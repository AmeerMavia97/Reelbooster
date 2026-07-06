"use client"
import { showModal } from '@/app/store/Slice/ModalsSlice';
import { useAppDispatch } from '@/app/utils/hooks';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function RechargeWithdrawButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <div className="flex gap-5 w-full">
      {/* Recharge button */}
      <button className="flex items-center justify-center gap-2 w-1/2 bg-main-green border border-main-green rounded-xl py-2.5 px-8 text-sm text-primary cursor-pointer"
      onClick={() => router.push('/setting/recharge')}>
        <Image src="/gift/Recharge.png" alt="recharge" width={24} height={24} />
        Recharge
      </button>

      {/* Withdraw button */}
      <button className="flex items-center justify-center gap-2 w-1/2 border border-main-green rounded-xl py-2.5 px-8 text-sm text-main-green cursor-pointer" onClick={() => dispatch(showModal("PaymentGatewayForWithdraw"))}>
        <Image src="/gift/Withdraw.png" alt="withdraw" width={24} height={24} />
        Withdraw
      </button>
    </div>
  );
}

export default RechargeWithdrawButton;
