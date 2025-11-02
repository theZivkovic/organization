import { User } from "src/core/entities/user";
import { MongooseUser } from "../models/userModel";
import { UserRole } from "src/core/enums/userRole";
import { MongooseAssociation } from "../models/associationModel";
import { Association } from "src/core/entities/association";
import { MongoosePlace } from "../models/placeModel";
import { PlaceType } from "src/core/enums/placeType";
import { Place } from "src/core/entities/place";

export function mapToUser(user: MongooseUser): User {
    return {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
        role: user.role as unknown as UserRole
    };
}

export function mapToFullUser(user: MongooseUser, place: MongoosePlace): User {
    return {
        ...mapToUser(user),
        place: mapToPlace(place),
    };
}

export function mapToAssociation(association: MongooseAssociation): Association {
    return {
        userId: association.userId,
        placeId: association.placeId
    };
}

export function mapToAssociationFull(association: MongooseAssociation, user: MongooseUser, place: MongoosePlace): Association {
    return {
        userId: association.userId,
        placeId: association.placeId,
        user: mapToUser(user),
        place: mapToPlace(place)
    };
}

export function mapToPlace(place: MongoosePlace): Place {
    return {
        id: place._id.toString(),
        name: place.name,
        type: place.type as unknown as PlaceType,
        left: place.left,
        right: place.right,
    }
}

export function mapToPlaceFull(place: MongoosePlace, users: Array<MongooseUser>): Place {
    return {
        ...mapToPlace(place),
        users: users.map(x => mapToUser(x))
    }
}