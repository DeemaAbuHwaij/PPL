// PPL 2023 HW4 Part2

// Q 2.1 

// Specify the return type.
export const delayedSum = async (a: number, b: number, delay: number): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(a + b);
      },
      delay);
    });
};

export const testDelayedSum = () => {
  const startTime = Date.now();
  const delay = 2000; 
  delayedSum(1, 2, delay).then((sum) => {
      const endTime = Date.now();
      const actualDelay = endTime - startTime;
      if (actualDelay >= delay)  {
        console.log("Test passed.");
        console.log(`The sum is: ${sum}`);
      }
      else if (actualDelay < delay) {
        console.log("Test failed, Delay is not satisfied");
      }
    })
    .catch((error) => console.log(`Error: ${error.message}`));
};
 

// Q 2.2

// Values returned by API calls.
export type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
}

// When invoking fetchData(postsUrl) you obtain an Array Post[]
// To obtain an array of posts
export const postsUrl = 'https://jsonplaceholder.typicode.com/posts'; 

// Append the desired post id.
export const postUrl = 'https://jsonplaceholder.typicode.com/posts/'; 

// When invoking fetchData(invalidUrl) you obtain an error
export const invalidUrl = 'https://jsonplaceholder.typicode.com/invalid';

// Depending on the url - fetchData can return either an array of Post[] or a single Post.
// Specify the return type without using any.
export const fetchData = async (url: string): Promise<Post[] | Post> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch - ${response.status}`);
    }
    return await response.json() as Promise<Post[] | Post>;
  }
  catch (error) {
    throw error;
  }
};
  

export const testFetchData = async (): Promise<void> => {
  try {
    const postsData = await fetchData(postsUrl) as Post[];
    if (!Array.isArray(postsData)) {
      throw new Error(`Expected postsData to be an array, but got ${typeof postsData}`);
    }
    if (!('userId' in postsData[0] && 'id' in postsData[0] && 'title' in postsData[0] && 'body' in postsData[0])) {
      throw new Error("Wrong structure");
    }
  }
  catch (error) {
    console.error(error);
  }
  try {
    const postData = await fetchData(postUrl + '1') as Post;
    if (typeof postData !== 'object' || Array.isArray(postData)) {
      throw new Error(`Expected postData to be an object, but got ${typeof postData}`);
    }
    if (!('userId' in postData && 'id' in postData && 'title' in postData && 'body' in postData)) {
      throw new Error("Wrong structure");
    }
  }
  catch (error) {
    console.error(error);
  }
  try {
    await fetchData(invalidUrl);
  }
  catch (error) {
    if (!(error instanceof Error)) {
      throw new Error(`Error:${typeof error}`);
    }
  }
};

// Q 2.3

// Specify the return type.
export const fetchMultipleUrls = async (urls: string[]): Promise<Post[]> => {
  if (urls.length === 0) {
    throw new Error("URLs array is empty");
  }
  const promises = urls.map((url) =>
    fetchData(url).catch((error) => {
      throw new Error(`Failed to fetch.`);
    }) as Promise<Post>
  );
  return await Promise.all(promises);
};

export const testFetchMultipleUrls = async () => {
  try {
      const urls = Array.from({length: 20}, (_, i) => postUrl + (i + 1));
      const data = await fetchMultipleUrls(urls);
      console.log(data);
      if (!Array.isArray(data) || data.length !== 20) {
          console.log(`Test failed.`);
      }
  }
  catch (error) {
      console.log(`Error: ${error}`);
  }
};
