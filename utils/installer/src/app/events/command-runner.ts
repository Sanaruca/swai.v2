import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const run = promisify(exec);

export async function checkWorkspace(): Promise<string> {
  console.log('📂 Current working directory:', process.cwd());
  return process.cwd();
}

export async function runBunInstall(): Promise<string> {
  console.log('📦 Installing dependencies...');
  const { stdout } = await run('bun i');
  return stdout;
}

export async function runPrismaPush(): Promise<string> {
  console.log('🔄 Pushing Prisma schema...');
  const { stdout } = await run('bun prisma db push');
  return stdout;
}

export async function runNxBuild(): Promise<string> {
  console.log('🔄 Building projects...');
  const { stdout } = await run(
    "bun nx run-many --target build --projects='swai,server'",
  );
  return stdout;
}

export async function runDatabaseSeed(
  user: string,
  pass: string,
): Promise<string> {
  console.log('🔄 Seeding database...');

  return new Promise((resolve, reject) => {
    const psql = spawn(
      'psql',
      [
        '-h',
        'localhost',
        '-p',
        '5432',
        '-U',
        user,
        '-d',
        'sanz',
        '-f',
        './prisma/seed.sql',
      ],
      {
        env: {
          ...process.env,
          PGPASSWORD: pass, // esto evita el prompt
        },
      },
    );

    psql.stdout.on('data', (data) => console.log(`📥 ${data}`));
    psql.stderr.on('data', (data) => {
      console.error(`❌ ${data}`);
      reject(`⚠️ Falló con código ${data}`);
    });
    psql.on('close', (code) => {
      if (code === 0) resolve('✅ Restauración completada');
      else reject(`⚠️ Falló con código ${code}`);
    });
  });
}

export async function runFinishInstall(): Promise<string> {
  console.log('🔄 Finishing installation...');
  const commands = [
    'bun i -g pm2 @dotenvx/dotenvx',
    'dotenvx run -- pm2 start --name swai-server node -- dist/swai/server/server.mjs',
    'pm2 save',
  ];

  const outputs = [];
  for (const command of commands) {
    const { stdout } = await run(command);
    outputs.push(stdout);
  }

  return outputs.join('\n\n');
}
