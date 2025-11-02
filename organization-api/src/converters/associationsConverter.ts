import { Association } from "src/infrastructure/models/associationModel";
import { AssociationDto } from "../dtos/associationDto";

export function associationModelToDto(association: Association): AssociationDto {
    return {
       userId: association.userId,
       placeId: association.placeId
    };
}