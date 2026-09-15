// このファイルは「型だけ」を定義するTypeScriptの宣言ファイル（.d.ts）
// interface = オブジェクトの形（どんなキーがあり、それぞれ何の型か）を定義するTypeScriptの機能
// ここで定義した型を各Pageコンポーネントでimportして使うことで、
// 「サーバーから渡ってくるデータに、存在しないプロパティでアクセスしてしまう」等のmiss を
// コンパイル時（npx tsc --noEmit）に検出できるようになる
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

// PageProps<T> = 全ページ共通で渡ってくるprops（auth）に、そのページ固有のprops（T）を合体させた型
// authの中身は、Laravel側のapp/Http/Middleware/HandleInertiaRequests.php の share() で
// 全ページ共通で渡すよう設定されている（Inertiaの仕組み）
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

// Laravelのpaginate()がそのままInertiaのpropsとして渡ってきた形
export interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
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
