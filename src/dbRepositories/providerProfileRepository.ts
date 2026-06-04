import constants from "../constants/constants";
import ProviderProfile from "../modals/ProviderProfile";
import mongoose from "mongoose";

const { MAX_DISTANCE_RADIUS } = constants;

export const upsertProviderProfile = async (filter : object, data : object, session : mongoose.ClientSession | null = null) => {
    const record = await ProviderProfile.findOneAndUpdate(
        filter,
        data,
        {   
            upsert: true,
            returnDocument: "after",
            session
        }
    );
    return record;
}



export const searchProvidersForCustomer = async (
    clientLatitude : number,
    clientLongitude : number ,
    service : string ,
    requirement : string ,
    category : string[]
) => {
    try {
        const providers =  await ProviderProfile.aggregate([
            {
                $geoNear: {
                    near: { 
                        type: "Point",
                        coordinates: [Number(clientLongitude) , Number(clientLatitude)  ]
                    },
                    distanceField: "calculatedDistance",
                    spherical: true,
                    maxDistance: MAX_DISTANCE_RADIUS,

                    query: {
                        $and: [
                            {
                                $or: [
                                    { is_available: true },
                                    { is_online: true }
                                ]
                            },

                            {
                                service_categories: {
                                    $in:[
                                        // service , ...category
                                        new RegExp(`^${service}`, "i"),
                                        ...category.map(val => new RegExp(`^${val}`, "i"))
                                    ] ,
                                }
                            }
                        ]
                    }
                },
            },
            {
                $match: {
                    $expr: {
                        $lte: ["$calculatedDistance", "$service_radius"]
                    }
                }
            } ,
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$user_id" },

                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"]
                                }
                            }
                        },
                        {
                            $project: {
                                first_name: 1,
                                last_name: 1,
                                phone: 1,
                                profile_image: 1
                            }
                        }
                    ],

                    as: "user"
                }
            },
            {
                $unwind: "$user"
            }
        ]);

        return providers;
    } catch (error) {
        throw error;
    }
};

