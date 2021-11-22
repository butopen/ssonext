import {FastifyRequest} from "fastify";
import {GenericRequest, TokenService} from "../token/token.service";
import {createParamDecorator, ExecutionContext, HttpException, HttpStatus} from "@nestjs/common";
import {findInjectedService} from "../shared/find-injected-service.function";


function extractTenant(request: FastifyRequest, tokenService: TokenService) {
    const tokenData = tokenService.checkAuthorized<{ tenant: string }>(request as unknown as GenericRequest)
    if (!tokenData.tenant)
        throw new HttpException("Could not find tenant on request for token " + tokenService.get(request as GenericRequest), HttpStatus.FORBIDDEN);
    return tokenData.tenant
}

let tokenService: TokenService

export const Tenant = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        if (!tokenService) {
            tokenService = findInjectedService(TokenService)
        }
        const request = ctx.switchToHttp().getRequest();
        const tenant = extractTenant(request, tokenService);
        return tenant
    },
);
