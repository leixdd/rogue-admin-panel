export interface IOrder {
    _id: string,
    account: string
    server: string
    payment_method: string
    telegram: string
    email: string
    discord: string
    uid: string
    amount: number
    notes: string
    image: string,
    createdAt?: Date
    updatedAt?: Date
    orderStatus: number
    remarks: String
    isDeleted: boolean
    streamerCode: string
}