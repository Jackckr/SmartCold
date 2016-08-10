package com.smartcold.zigbee.manage.dto;

public class PersonalCommentDTO {
	private CommentDTO commentdto;
	private String rdcname;
	private String logo;

	public CommentDTO getCommentdto() {
		return commentdto;
	}

	public void setCommentdto(CommentDTO commentdto) {
		this.commentdto = commentdto;
	}

	public String getRdcname() {
		return rdcname;
	}

	public void setRdcname(String rdcname) {
		this.rdcname = rdcname;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

}
