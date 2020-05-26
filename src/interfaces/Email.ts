export interface IEmail {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
}