
/**
 * AUTO-GENERATED FILE @ Mon, 15 Nov 2021 11:39:41 GMT
 */



export interface SnUser { 
	userid: number
	email?: string | null
	password?: string | null
	roles?: unknown | null
	created?: Date | null
	tenant?: string | null
	info?: unknown | null 
}

export interface SnTables {
    sn_user: SnUser
}

export const SnTablesData = {
        tableNames: {sn_user: "sn_user"}, 
        sn_user: {tableName: "sn_user", userid: "sn_user.userid",email: "sn_user.email",password: "sn_user.password",roles: "sn_user.roles",created: "sn_user.created",tenant: "sn_user.tenant",info: "sn_user.info"}
    }