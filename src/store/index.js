import { Database } from "../database.js";
import Vue from "vue";
import Vuex from "vuex";

// import example from './module-example'

Vue.use(Vuex);

export default function() {
    const Store = new Vuex.Store({
        modules: {
            // example
        },
        state() {
            return {
                //QRCodeString: 'https://www.safeentry-qr.gov.sg/complete/PROD-S83CS0191L-NTUC-NORTHPOINT-SE/fc4de45f-e7bf-44e7-8650-ad4db82d1c16',
                //QRCodeString: 'https://www.safeentry-qr.gov.sg/tenant/PROD-S83CS0191L-NTUC-NORTHPOINT-SE',
                QRCodeString: "",
                externalAlertString: "",
                userId: "",
                userPhone: "",
                isResident: 1,
                lastUrl: "",
                newUser: false,
                currentLocation: null,
                db: null,
                locations: [
                    // {
                    //     id: 9,
                    //     name: "NTUC Fairprice - Northpoint City",
                    //     title: "NTUC Fairprice - Northpoint City",
                    //     url:
                    //         "https://www.safeentry-qr.gov.sg/tenant/PROD-S83CS0191L-NTUC-NORTHPOINT-SE",
                    //     lastUrl: "",
                    //     icon: "place",
                    //     coordinates: "",
                    //     favourite: 0,
                    //     optionIndex: null,
                    //     checkedin: 0
                    // }
                ],
                checkedinLocations: []
            };
        },
        mutations: {
            QRCodeString(state, url) {
                state.QRCodeString = url;
            },
            externalAlertString(state, str) {
                state.externalAlertString = str
            },
            userId(state, str) {
                state.userId = str;
            },
            userPhone(state, str) {
                state.userPhone = str;
            },
            isResident(state, boolNum) {
                state.isResident = boolNum;
            },
            lastUrl(state, url) {
                state.lastUrl = url;
            },
            locationsLoad(state, locations) {
                state.locations = locations;
            },
            locationsNew(state, location) {
                state.locations.push(location);
            },
            locationsEdit(state, payload) {
                state.locations.splice(payload.index, 1, payload.location);
            },
            locationsDelete(state, index) {
                state.locations.splice(index, 1);
            },
            checkedinLocationsLoad(state, locations) {
                state.checkedinLocations = locations;
            },
            checkedinLocationsNew(state, location) {
                state.checkedinLocations.unshift(location);
            },
            checkedinLocationsDelete(state, index) {
                state.checkedinLocations.splice(index, 1);
            },
            newDb(state) {
                state.db = new Database();
            },
            locationsSort(state, coordinates) {
                //NOTE this is not a proper calculation of distance based on lat and long, it is just a rough calculation
                for (let [i, location] of state.locations.entries()) {
                    location.distance =
                        (coordinates.lat - location.coordinates.lat) ** 2 +
                        (coordinates.long - location.coordinates.long) ** 2;
                    state.locations.splice(i, 1, location);
                }
                state.locations.sort(
                    (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
                );
            },
            newUser(state, boolean) {
                state.newUser = boolean;
            },
        },
        actions: {
            QRCodeStringAction(context, url) {
                context.commit("QRCodeString", url);
            },
            externalAlertStringAction(context, str) {
                context.commit("externalAlertString", str)
            },
            async userInformationAction(context, payload) {
                //Payload eg: {userId: XXXX, userPhone: XXXXX, isResident: 1 or 0}
                context.commit("userId", payload.userId);
                context.commit("userPhone", payload.userPhone);
                context.commit("isResident", payload.isResident);
                context.commit("newUser", false);
                await context.getters.db.putUserInfo(
                    payload.userId,
                    payload.userPhone,
                    payload.isResident
                );
            },
            async userInformationLoadAction(context) {
                const userInfo = await context.getters.db.getUserInfo();
                if (userInfo.userId) {
                    context.commit("userId", userInfo.userId);
                    context.commit("userPhone", userInfo.userPhone);
                    context.commit("isResident", userInfo.isResident);
                } else {
                    context.commit("newUser", true);
                }
            },
            disableNewUser(context) {
                context.commit('newUser', false)
            },
            lastUrlAction(context, url) {
                context.commit("lastUrl", url);
            },
            async locationsLoadAction(context) {
                const locations = await context.getters.db.getLocations(0);
                const checkedinLocations = await context.getters.db.getLocations(
                    1
                );
                context.commit("locationsLoad", locations);
                context.commit("checkedinLocationsLoad", checkedinLocations);
            },
            async locationsNewAction(context, location) {
                await context.getters.db.postLocation(location).then(id => {
                    location.id = id;
                });
                context.commit("locationsNew", location);
            },
            async locationsTitleEditAction(context, payload) {
                //Payload contains payload.location and payload.index
                context.commit("locationsEdit", payload);
                await context.getters.db.putLocationTitle(payload.location.id, payload.location.title)
            },
            async locationsIconEditAction(context, payload) {
                //Payload contains payload.location and payload.index
                context.commit("locationsEdit", payload);
                await context.getters.db.putLocationIcon(payload.location.id, payload.location.icon)
            },
            async locationsDeleteAction(context, index) {
                const id = context.getters.locations[index].id;
                context.commit("locationsDelete", index);
                await context.getters.db.deleteLocation(id);
            },
            async locationCheckinAction(context, index) {
                let location = context.getters.locations[index];
                location.lastUrl = context.getters.lastUrl;
                location.checkedin = 1;
                context.commit("checkedinLocationsNew", location);
                context.commit("locationsDelete", index);
                await context.getters.db.putLocationCheckin(
                    location.id,
                    1,
                    context.getters.lastUrl
                );
            },
            async locationCheckoutAction(context, index) {
                let location = context.getters.checkedinLocations[index];
                location.lastUrl = context.getters.lastUrl;
                location.checkedin = 0;
                context.commit("locationsNew", location);
                context.commit("checkedinLocationsDelete", index);
                await context.getters.db.putLocationCheckin(
                    location.id,
                    0,
                    context.getters.lastUrl
                );
            },
            sortLocationsByDistance(context, coordinates) {
                context.commit("locationsLoad", coordinates);
            },
            newDb(context) {
                context.commit("newDb");
            },
            locationsSort(context, coordinates) {
                context.commit("locationsSort", coordinates);
            },
        },
        getters: {
            QRCodeString(state) {
                return state.QRCodeString;
            },
            externalAlertString(state) {
                return state.externalAlertString;
            },
            userId(state) {
                return state.userId;
            },
            userPhone(state) {
                return state.userPhone;
            },
            isResident(state) {
                return state.isResident;
            },
            newUser(state) {
                return state.newUser;
            },
            lastUrl(state) {
                return state.lastUrl;
            },
            locations(state) {
                return state.locations;
            },
            checkedinLocations(state) {
                return state.checkedinLocations;
            },
            db(state) {
                return state.db;
            },
        }
    });

    return Store;
}
