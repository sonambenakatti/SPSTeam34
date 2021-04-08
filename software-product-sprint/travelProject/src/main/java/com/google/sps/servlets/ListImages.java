package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.api.gax.paging.Page;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Shows all of the images uploaded to Cloud Storage. */
@WebServlet("/show-images")
public class ListImages extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // List all of the uploaded files.
    String projectId = "spring21-sps-34";
    String bucketName = "spring21-sps-34.appspot.com";
    Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
    Bucket bucket = storage.get(bucketName);
    Page<Blob> blobs = bucket.list();

    // Output <img> elements as HTML.
    /*
    response.setContentType("text/html;");
    for (Blob blob : blobs.iterateAll()) {
      String imgTag = String.format("<img src=\"%s\" />", blob.getMediaLink());
      response.getWriter().println(imgTag);
      response.getWriter().println("<br>");
    }
    */
    response.setContentType("application/json;");
    ArrayList<String> blobData = new ArrayList<String>();
    for (Blob blob : blobs.iterateAll()) {
      blobData.add(blob.getMediaLink());
    }
    String json = convertToJsonUsingGson(blobData);
    response.getWriter().println(json);
    }

    private String convertToJsonUsingGson(ArrayList<String>blobData) {
    Gson gson = new Gson();
    String json = gson.toJson(blobData);
    return json;
  }
  
}