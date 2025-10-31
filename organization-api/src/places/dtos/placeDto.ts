export enum PlaceTypeDto {
    OFFICE = "OFFICE",
    STORE = "STORE"
};

export type PlaceDto = {
    name: string;
    type: PlaceTypeDto;
}