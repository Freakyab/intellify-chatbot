Sure, here's the updated `README.md` file with the requested changes:

```markdown
# Next.js Application

This is a Next.js application with authentication handled by Supabase. This application also integrates with Google APIs using an API key.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed on your local machine (v14.x.x or later recommended).
- npm (Node Package Manager) installed.
- A Supabase account and a project set up.
- A Google API key.

## Getting Started

To get a local copy of this project up and running, follow these steps:

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Freakyab/intellify-chatbot.git
    cd your-repository
    ```

2. **Install the dependencies:**

    ```sh
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the root of your project and add your Supabase credentials and Google API key:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key
```

Replace `your-supabase-url`, `your-supabase-anon-key`, and `your-google-api-key` with your actual Supabase URL, Supabase anon key, and Google API key respectively.

### Running the Application

1. **Run the development server:**

    ```sh
    npm run dev
    ```

2. Open your browser and go to [http://localhost:3000](http://localhost:3000) to see your application in action.

### Login

To login to the application, use the following credentials:

- **Email:** text@gmail.com
- **Password:** text@22

For testing purposes, you can use the above credentials to log in.

## Usage

Here are some common commands you might need:

- **Run the development server:**

    ```sh
    npm run dev
    ```

- **Build the application for production:**

    ```sh
    npm run build
    ```

- **Start the application in production mode:**

    ```sh
    npm start
    ```

- **Run tests:**

    ```sh
    npm test
    ```

## Contributing

To contribute to this project, please fork the repository and create a pull request. We welcome all contributions!

## Contact

If you have any questions or need further assistance, feel free to reach out at [aryanbhisikar1@gmail.com](mailto:aryanbhisikar1@gmail.com).

```

Feel free to customize the `README.md` file further to fit your specific project details and requirements.