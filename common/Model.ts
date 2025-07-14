export interface IRequestFeeling {
    feeling1: number;
    feeling2: number,
    feeling3: number,
    feeling4: number,
    phraseGratitude: string,
    regle: boolean
}

export interface IHistory extends IRequestFeeling {
    date: string
}