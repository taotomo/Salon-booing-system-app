export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

// サロン一覧・詳細ページはログイン不要なため、
// auth.user は「ログイン中ならUser、未ログインならnull」を表す
// isOwner = ログイン中のユーザーが1件以上サロンを所有しているか（管理者ダッシュボードの表示切り替えに使う）
export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
        isOwner: boolean;
    };
};

// サロンの業種（bookings.statusと同じくDB側もenumで固定）
export type SalonGenre = 'hair' | 'nail' | 'eyelash' | 'relaxation';

export interface Staff {
    id: number;
    salon_id: number;
    name: string;
    position: string | null;
    bio: string | null;
    image: string | null;
}

export interface Service {
    id: number;
    salon_id: number;
    name: string;
    description: string | null;
    price: number;
    duration: number;
}

export interface Review {
    id: number;
    user_id: number;
    salon_id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user?: User;
    salon?: Salon;
}

export interface Salon {
    id: number;
    user_id: number;
    genre: SalonGenre;
    name: string;
    address: string;
    lat: number | null;
    lng: number | null;
    description: string | null;
    phone: string | null;
    image: string | null;
    staffs?: Staff[];
    services?: Service[];
    reviews?: Review[];
    // オーナーダッシュボードでのみ付与される（withCountで計算）
    pending_bookings_count?: number;
}

export interface Booking {
    id: number;
    user_id: number;
    salon_id: number;
    staff_id: number;
    service_id: number;
    start_at: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    note: string | null;
    salon?: Salon;
    staff?: Staff;
    service?: Service;
    user?: User;
}
