using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Repositories.Interfaces; 
using backend.Repositories.Implementations; 
using backend.Services.Interfaces;
using backend.Services.Implementations;
using backend.Services;
using backend.Repositories;   
using Hangfire;
using Hangfire.MySql;
using MySql.Data.MySqlClient;




//Entry Point of the application: Main method in Program.cs

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var defaultConnectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "DefaultConnection is missing from configuration.");

var hangfireEnabled =
    builder.Configuration.GetValue<bool?>("Hangfire:Enabled")
    ?? !builder.Environment.IsDevelopment();

if (hangfireEnabled)
{
    var hangfireConnectionString =
        builder.Configuration.GetConnectionString("HangfireConnection")
        ?? defaultConnectionString;

    var hangfireConnectionBuilder =
        new MySqlConnectionStringBuilder(hangfireConnectionString)
        {
            AllowUserVariables = true
        };

    builder.Services.AddHangfire(config =>
    {
        config.UseStorage(new MySqlStorage(
            hangfireConnectionBuilder.ConnectionString,
            new MySqlStorageOptions
            {
                QueuePollInterval = TimeSpan.FromSeconds(15)
            }
        ));
    });
}

//Service and Repository registrations for Dependency Injection

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        defaultConnectionString,
        ServerVersion.AutoDetect(defaultConnectionString)
    ),
    contextLifetime: ServiceLifetime.Scoped,
    optionsLifetime: ServiceLifetime.Scoped
);

builder.Services.AddMemoryCache();
if (hangfireEnabled)
{
    builder.Services.AddHangfireServer();
}

//Registering services and repositories for Dependency Injection

builder.Services.AddScoped<IAssessmentsService, AssessmentsService>();
builder.Services.AddScoped<IAssessmentRepository, AssessmentRepository>();

builder.Services.AddScoped<IUserSessionsService, UserSessionsService>();
builder.Services.AddScoped<IUserSessionRepository, UsersessionRepository>();   

builder.Services.AddScoped<IStudentResultService, StudentResultService>();
builder.Services.AddScoped<IStudentResultRepository, StudentResultRepository>();

builder.Services.AddScoped<IUserSessionRepository, UsersessionRepository>();
builder.Services.AddScoped<IQuestionsRepository, QuestionsRepository>();
builder.Services.AddScoped<IQuestionsService, QuestionsService>(); 

// builder.Services.AddScoped<ILayersService, LayersService>();
// builder.Services.AddScoped<ILayersRepository, LayersRepository>();

builder.Services.AddScoped<IStudentsRepository, StudentsRepository>();
builder.Services.AddScoped<IStudentsService, StudentsService>();

 

builder.Services.AddScoped<ICreateTestService, CreateTestService>();
builder.Services.AddScoped<ICreateTestRepository, CreateTestRepository>();

builder.Services.AddScoped<IScoreService, ScoreService>();
builder.Services.AddScoped<IScoreRepository, ScoreRepository>();

builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IExpertiseService,ExpertiseService>();
builder.Services.AddScoped<IExpertiseRepository,ExpertiseRepository>();

builder.Services.AddScoped<IRolesService,RolesService>();
builder.Services.AddScoped<IRolesRepository,RolesRepository>();



//CORs configuration
// to allow cross-origin requests from any domain, which is useful for development and testing purposes.

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

//Database connectivity: ado.net and Entity framework
//Dapper:library that provides a simple and efficient way 
//to execute SQL queries and map results to C# objects,'
// often used for performance-critical scenarios or when you want more control over the SQL being executed.


//Dapper:

Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;


var app = builder.Build();


//Middleware configuration: CORS, Authorization, and routing for controllers
app.UseCors("AllowAll");

app.UseDeveloperExceptionPage();

app.UseAuthorization();
app.MapControllers();

if (hangfireEnabled)
{
    app.UseHangfireDashboard("/hangfire");
}



app.Run();