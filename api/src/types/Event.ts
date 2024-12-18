export interface Event {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    date_start: Date;
    date_end: Date;
    plutaMultiplier: number;
    plutaBonus: number;
    created_at: Date;
}