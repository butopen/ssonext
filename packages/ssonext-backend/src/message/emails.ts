export const emails = {
  welcome(token: string, backendUrl: string) {
    return {
      subject: 'SSONext: Welcome - confirm your email',
      body: `

<h1>Welcome to SSONext</h1>
<p>To start managing your users, please confirm your email:</p>

<a href='${backendUrl}/app/getting-started?step=2&token=${token}' 
    style='text-decoration:none;display:inline-block;color:#ffffff;background-color:#00cf80;
        border-radius:4px;width:auto;padding:12px;margin:15px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;
        text-align:center;text-shadow: 0 0 1px #004609;font-weight: 700;' 
    target='_blank'>
    CONFIRM EMAIL
</a>

<p>or use the following link:<p> 
<br>
${backendUrl}/app/getting-started?step=2&token=${token}

<p>Enjoy managing users with easy.</p>


<p>Sincerely, <br>The SSONext team</p>
      
      `,
    };
  },
  credentials(
    email: string,
    password: string,
    tanantId: string,
    postgresPassword: string,
    backendUrl: string,
  ) {
    return {
      subject: 'SSONext: your credentials',
      body: `
<h1>You just created your project</h1>
<h2>Your SSONext dashboard credentials</h2>
<p>You just created your SSONext backend.</p>

<p>You can access SSONext at the following URL:</p>
<br>
<b>${backendUrl}/app/login</b>
<br>
<p>Using the following credentials:</p>

<br>
<div style='background: #d8ffdb; border-radius: 4px; padding: 12px'>
Email: ${email}
<br>
Password: ${password}
<br>
</div>

<h2>Your personal Postgres DB credentials</h2>
<p>SSONext is Open Source. But Open Source is not enough. SSONext is <b>Open DB</b>.</p>

<p><b>Open DB</b> means you have access to your own database.</p>

<p>Here you can find your Postgres DB credentials:</p>

<br>
<div style='background: #d8ffdb; border-radius: 4px; padding: 12px'>
Host: db.ssonext.com
<br>
Port: 5432
<br>
Username: ${tanantId}
<br>
Password: ${postgresPassword}
<br>
</div>

<h3>What you can do with your Postgres DB credentials?</h3>
<ul>
<li><b>Data Export</b>: Export your users data anytime</li>
<li><b>Integration</b>: Access your DB from any backend software and integrate with your users data.</li>
<li><b>Statistics</b>: Query the DB using any <i>select</i> SQL query</li>
</ul>

<h4>Warning: we do not own your passwords</h4>
<div style='background: #ffd8d8; border-radius: 4px; padding: 12px'>
<p>
Note that we do not have your password saved in our system. We cannot send them anymore.
</p>
<p>However you can reset them anytime from your dashboard.</p>
</div>
<br>
<p>Enjoy managing users with easy.</p>
<p>Sincerely, <br>The SSONext team</p>    
    
`,
    };
  },
};
