const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTrips() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trips");
  }

  return res.json();
}

export async function getTrip(id: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/trips/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch trip");
  }

  return res.json();
}

export async function generateTrip(data: {
  destination: string;
  budget: number;
  days: number;
  travel_style: string;
}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to generate trip");
  }

  return res.json();
}

export async function askQuestion(question: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to ask question");
  }

  return res.json();
}

export async function createConversation() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create conversation");
  }

  return res.json();
}

export async function getConversations() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return res.json();
}

export async function getConversationMessages(
  conversationId: number
) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch conversation messages");
  }

  return res.json();
}

export async function sendMessage(
  conversationId: number,
  content: string
) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}