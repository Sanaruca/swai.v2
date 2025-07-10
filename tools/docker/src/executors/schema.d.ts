export interface BuildExecutorSchema<MapEnvirotmentToBuildArgs extends boolean = boolean> {
    tag: string;
    dockerfile?: string;
    context?: string;
    envPrefix?: string;
    envFile?: string;
    buildArgs: MapEnvirotmentToBuildArgs extends true ? string[] : {[key: string]: string}
    /**
     * @default false
     */
    mapEnvirotmentToBuildArgs: MapEnvirotmentToBuildArgs,
    /**
     * @default true
     */
    readBuildArgsFromDockerFile: boolean
} // eslint-disable-line
