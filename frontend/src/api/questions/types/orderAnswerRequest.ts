import type { Identifier } from "@/api/utils.ts"

export interface OrderAnswerRequest {
    answer: string
}

export interface OrderAnswerResponse extends OrderAnswerRequest, Identifier {}
