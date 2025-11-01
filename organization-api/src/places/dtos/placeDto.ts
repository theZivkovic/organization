export enum PlaceTypeDto {
    OFFICE = "OFFICE",
    STORE = "STORE"
};

export type PlaceDto = {
    id: string;
    name: string;
    type: PlaceTypeDto;
}