import Dexie from "dexie";

export class Database extends Dexie {
    constructor() {
        super("database");
        this.version(7).stores({
            locations: "++id,checkedin",
            userInfo: "++id"
        });
        this.locations = this.table("locations");
        this.userInfo = this.table("userInfo");
    }

    async getLocations(checkedin) {
        let locations = await this.locations
            .where({ checkedin: checkedin })
            .toArray();
        return locations;
    }

    putLocationCheckin(id, checkedin, lastUrl) {
        return this.locations.update(id, {
            checkedin: checkedin,
            lastUrl: lastUrl
        });
    }

    putLocationTitle(id, title) {
        return this.locations.update(id, {
            title: title
        })
    }

    putLocationIcon(id, icon) {
        return this.locations.update(id, {
            icon: icon
        })
    }

    postLocation(location) {
        return this.locations.add(location);
    }

    deleteLocation(id) {
        return this.locations.delete(id);
    }

    async getUserInfo() {
        let userInfo = await this.userInfo.toArray();
        if (userInfo.length == 0)
            this.userInfo.add({ userId: "", userPhone: "", isResident: 1 });
            userInfo = await this.userInfo.toArray();
        return userInfo[0];
    }

    async putUserInfo(userId, userPhone, isResident) {
        let currentInfo = await this.getUserInfo()
        return this.userInfo.update(currentInfo.id, {
            userId: userId,
            userPhone: userPhone,
            isResident: isResident
        });
    }
}
