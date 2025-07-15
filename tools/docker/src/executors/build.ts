import { PromiseExecutor } from '@nx/devkit';
import { BuildExecutorSchema } from './schema';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

// TODO: refactor

const runExecutor: PromiseExecutor<BuildExecutorSchema> = async (
  options,
  context
) => {
  console.log('Executor ran for docker build');

  const validatedOptions = validateOptions(options);

  const projectName = context.projectName;
  if (!projectName) {
    throw new Error('Project name is not defined in the context.');
  }

  const projectRoot = context.projectsConfigurations.projects[projectName].root;

  let dockerfilePath = options.dockerfile;

  if (!dockerfilePath) {
    dockerfilePath = path.join(projectRoot, 'Dockerfile').replace(/\\/g, '/');
    console.log('⚙️ Loading Dockerfile from:', dockerfilePath);
    if (!fs.existsSync(dockerfilePath)) {
      throw new Error(
        `\x1B[31mDockerfile not found: ${dockerfilePath}. Set "dockerfile" option.\x1B[0m`
      );
    }
    console.log('✅ Dockerfile:', dockerfilePath);
  }

  if (validatedOptions.mapEnvirotmentToBuildArgs) {
    if (validatedOptions.readBuildArgsFromDockerFile) {
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf-8');
      const buildArgsRegex = /ARG\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
      const _buildArgs = new Set<string>();
      let match;
      while ((match = buildArgsRegex.exec(dockerfileContent)) !== null) {
        _buildArgs.add(match[1]);
      }
      console.log('✅ Build args loaded from Dockerfile:', _buildArgs);
      validatedOptions.buildArgs = Array.from(_buildArgs);
    }
  }

  const valid_env_keys = validatedOptions.mapEnvirotmentToBuildArgs
    ? (validatedOptions.buildArgs as string[])
    : Object.keys(validatedOptions.buildArgs);

  // Cargar variables de entorno desde el envfile, si se proporciona
  if (validatedOptions.envFile) {
    const envfilePath = path.resolve(context.root, validatedOptions.envFile);
    if (!fs.existsSync(envfilePath)) {
      throw new Error(`File env '${envfilePath}' not found.`);
    }

    dotenv.config({ path: envfilePath });
    console.log('\x1B[32m✅ Env file loaded from:\x1B[0m', envfilePath);
  }
  

  console.log('\x1B[34mBuild args loaded from env:\x1B[0m');

  const cliBuildArgs = Object.entries(process.env)
    .filter(([key]) => key.startsWith(validatedOptions.envPrefix))
    .reduce((acc, [key, value]) => {
      const argName = key.replace(validatedOptions.envPrefix, '');

      if (valid_env_keys.includes(argName)) {
        console.log(
          '  \x1B[34m' + `--build-arg ${argName}="${value}"` + '\x1B[0m'
        );
        return [...acc, `--build-arg ${argName}="${value}"`];
      }

      return acc;
    }, [] as string[]);

  const imagetag = validatedOptions.tag === 'latest' ? `${projectName}` : `${projectName}:${validatedOptions.tag}`;

  const command = `docker build ${cliBuildArgs.join(' ')} -t ${imagetag} -f ${dockerfilePath} ${validatedOptions.context}`;

  console.log(
    '⚙️ Running docker build command with \x1B[33m' +
      cliBuildArgs.length +
      '\x1B[0m args:'
  );
  console.log(
    '\x1B[1m' +
      `🔨 docker build ... -t ${imagetag} -f ${dockerfilePath} ${validatedOptions.context}` +
      '\x1B[0m'
  );

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: context.root,
      encoding: 'utf-8',
    });
    return { success: true };
  } catch (e) {
    console.error('\x1B[31m❌ Docker build failed:\x1B[0m');
    if (context.isVerbose) {
      console.error(e);
    } else {
      console.error('run target with --verbose for more details');
    }
    return { success: false };
  }
};

export default runExecutor;

function validateOptions(options: BuildExecutorSchema): BuildExecutorSchema {
  const defaultOptions = {
    context: '.',
    mapEnvirotmentToBuildArgs: false,
    buildArgs: {},
    envPrefix: '',
    readBuildArgsFromDockerFile: true,
  };

  const optionsWithDefaults = {
    ...defaultOptions,
    ...options,
  };

  if (optionsWithDefaults.mapEnvirotmentToBuildArgs) {
    if (optionsWithDefaults.readBuildArgsFromDockerFile) {
      optionsWithDefaults.buildArgs = [];
    } else if (!options.buildArgs) {
      optionsWithDefaults.buildArgs = [];
    } else if (!Array.isArray(optionsWithDefaults.buildArgs)) {
      throw new Error(
        '"buildArgs" must be an array when "mapEnvirotmentToBuildArgs" is true'
      );
    }
  }

  return optionsWithDefaults;
}
