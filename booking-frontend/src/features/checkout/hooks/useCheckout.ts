import { useCallback, useEffect, useState } from 'react';
import { checkoutApi } from '../api';
import type { StayBooking, StayBookingPayload } from '../types';

type UseCheckout = {
  stays: StayBooking[];
  loading: boolean;
  bookStay: (payload: StayBookingPayload) => Promise<void>;
  cancelStay: (id: string) => Promise<void>;
};

const useCheckout = (): UseCheckout => {
  const [stays, setStays] = useState<StayBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await checkoutApi.list();
    setStays(data);
    setLoading(false);
  }, []);

  const bookStay = useCallback(async (payload: StayBookingPayload) => {
    const created = await checkoutApi.create(payload);
    setStays((prev) => [...prev, created]);
  }, []);

  const cancelStay = useCallback(async (id: string) => {
    await checkoutApi.cancel(id);
    setStays((prev) => prev.map((stay) => (stay.id === id ? { ...stay, status: 'cancelled' } : stay)));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { stays, loading, bookStay, cancelStay };
};

export { useCheckout };
export default useCheckout;
