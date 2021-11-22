import {Inject} from "@nestjs/common";


export function findInjectedService(c){
    const serviceInjector = Inject(c)
    const serviceSupplier = {instance: null}
    serviceInjector(serviceSupplier, "instance")
    return serviceSupplier.instance
}
