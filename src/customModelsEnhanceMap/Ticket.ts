import {TicketScalarFieldEnum, ModelConfig} from "../generated/typegraphql-prisma";
import {Authorized} from "type-graphql";
import {AuthRole} from "../context";

let defaultPerms: {[key: string]: MethodDecorator[]} = {};
Object.keys(TicketScalarFieldEnum).forEach((value: string) => defaultPerms[value] = [Authorized(AuthRole.ADMIN, AuthRole.MANAGER)] )

export const ticketEnhanceConfig: ModelConfig<"Ticket"> = {
    fields: {
        ...defaultPerms,
        id: [],
    }
}
