package de.jmens.ariadne.tag;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Entity
@Table(name = "tag")

public class TagEntity implements Tag
{
	@Id
	@Column(name = "file_id")
	private UUID fileId = UUID.randomUUID();

	@Column(name = "scan_id")
	private UUID scanId;

	@Column(name = "album")
	private String album;

	@Column(name = "artist")
	private String artist;

	@Column(name = "title")
	private String title;

	@Column(name = "track")
	private String track;

	@Column(name = "year")
	private String year;

	@Column(name = "genre")
	private int genre;

	@Override
	public String getYear()
	{
		return year;
	}

	@Override
	public void setYear(String year)
	{
		this.year = year;
	}

	@Override
	public String getAlbum()
	{
		return album;
	}

	@Override
	public void setAlbum(String album)
	{
		this.album = album;
	}

	@Override
	public String getArtist()
	{
		return artist;
	}

	@Override
	public void setArtist(String artist)
	{
		this.artist = artist;
	}

	@Override
	public String getTitle()
	{
		return title;
	}

	@Override
	public void setTitle(String title)
	{
		this.title = title;
	}

	@Override
	public String getTrack()
	{
		return track;
	}

	@Override
	public void setTrack(String track)
	{
		this.track = track;
	}

	@Override
	public int getGenre()
	{
		return genre;
	}

	@Override
	public void setGenre(int genre)
	{
		this.genre = genre;
	}

	@Override
	public void setScanId(UUID id)
	{
		this.scanId = id;
	}

	@Override
	public UUID getScanId()
	{
		return this.scanId;
	}

	@Override
	public void setFileId(UUID id)
	{
		this.fileId = id;
	}

	@Override
	public UUID getFileId()
	{
		return this.fileId;
	}

	@Override
	public String toString()
	{
		return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

	@Override
	public int hashCode()
	{
		return HashCodeBuilder.reflectionHashCode(this);
	}

	@Override
	public boolean equals(Object object)
	{
		return EqualsBuilder.reflectionEquals(this, object);
	}
}