"use server";

export default async function deleteDriverLocation(email) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  const url = `https://direct-transport-server.vercel.app/api/locations/delete_current_location/${email}`;
  console.log(url);

  fetch(url, requestOptions);
}
