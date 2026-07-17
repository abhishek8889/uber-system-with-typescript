export class ServiceRequestResource {
    // static transform(item: any) {
    //     return {
    //         id: item._id,
    //         service: item.service,
    //         requirement: item.requirement,
    //         distance: item.calculatedDistance,

    //         customer: item.customer
    //             ? {
    //                 id: item.customer._id,
    //                 name: item.customer.name,
    //                 phone: item.customer.phone
    //             }
    //             : null
    //     };
    // }

    // static collection(items: any[]) {
    //     return items.map(item => this.transform(item));
    // }

    static requestDetails (item : any){
        return {
            id: item._id,
            customer_id : item?.customer_id,
            location_name : item?.location_name,
            customer_location : item?.customer_location,
            requirement : item?.requirement,
            service: item?.service,
            service_type: item?.service_type,
            distance: item?.calculatedDistance,
            customer_quotation: item?.customer_quotation,
            category: item?.category,
            status: item?.status,
            customer: item?.customer
                ? {
                    id: item?.customer?._id,
                    first_name: item?.customer?.first_name,
                    last_name: item?.customer?.last_name,
                    phone: item?.customer?.phone
                }
                : null
        }
    }
}