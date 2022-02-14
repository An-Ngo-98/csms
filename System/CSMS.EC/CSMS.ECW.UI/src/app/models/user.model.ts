export interface User {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    birthday: Date;
    gender: string;
    password: string;
    accessToken: string
    data: User
}

export interface UserToCreate {
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    birthday: Date;
    gender: string;
    password: string;
}

export interface Socialusers {
    // provider: string;
    // id: string;
    email: string;
    name: string;
    // image: string;
    // token?: string;
    // idToken?: string;
}

export interface UserToUpdate {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    birthday: Date;
    gender: string;
}

export interface UserReview {
    items: UserItemReview[],
    pageIndex: number,
    pageSize: number,
    totalCount: number,
}
export interface UserItemReview {
    fullName: string;
    productId: number;
    invoiceId: number;
    productName: string;
    productPhotoId: number;
    score: number;
    title: string;
    comment: string;
    votedDate: Date;
}
