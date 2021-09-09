import { Prisma } from "@prisma/client"
import {FieldResolver, Resolver, Ctx, Root, Arg, Mutation, Args} from "type-graphql";
import {FindUniqueVenueArgs, Venue, VenueWhereInput, VenueWhereUniqueInput} from "../generated/typegraphql-prisma";
import {Context} from "../context";
import dot from "dot-object";

@Resolver(of => Venue)
export class CustomVenueResolver {
    @FieldResolver(type => String, {nullable: true})
    getMetadata(
        @Root() venue: Venue,
        @Arg("key") key: string,
        ): String | null {
        if (!venue.metadata) return null;
        const metadataObject = venue.metadata as Prisma.JsonObject;
        const value = dot.pick(key, metadataObject)
        if(value) return value.toString()
        return null
    }
    @Mutation(_returns => Venue, {nullable: true})
    async setVenueMetadata(
        @Args() args: FindUniqueVenueArgs,
        @Arg("key") key: string,
        @Arg("value") value: string,
        @Ctx() { prisma }: Context,
    ): Promise<Venue | null> {
        const venue = await prisma.venue.findUnique({
            ...args,
            select: {
                metadata: true
            }
        });
        if (!venue) return null;
        const metadataObject = venue.metadata as Prisma.JsonObject || {}
        dot.str(key, value, metadataObject)
        return await prisma.venue.update({...args, data: {metadata: metadataObject}})
    }
}
