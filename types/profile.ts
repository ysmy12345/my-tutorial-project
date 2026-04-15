export interface Profile {
  firstName: string | null;
  lastName: string | null;
  profileCompleted: boolean;
  dateOfBirth: string | null;
  gender: string | null;
  birthdateChanged: boolean;
  address: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  metadata: string;
}

export interface UserProfile {
  email: string;
  mobileNo: string | null;
  mobileCountryCode: string | null;
  profile: Profile;
}

export const formatAddress = (
  address?: string | null,
  postalCode?: string | null,
  country?: string | null
) => {
  return [address, postalCode, country].filter(Boolean).join(", ") || "";
};

// Function to parse metadata and extract company address
export const parseCompanyInfo = (metadata: string | null) => {
  try {
    if (!metadata)
      return { companyName: "", country: "", postalCode: "", address: "", gst: undefined };

    const parsedMetadata = JSON.parse(metadata);
    const companyName = parsedMetadata.companyName || "";
    const country = parsedMetadata.companyAddress?.country || "";
    const postalCode = parsedMetadata.companyAddress?.postalCode || "";
    const address = parsedMetadata.companyAddress?.address || "";
    const gst = parsedMetadata.gst !== undefined ? parsedMetadata.gst : undefined;

    return { companyName, country, postalCode, address, gst };
  } catch (error) {
    console.error("Failed to parse metadata:", error);
    return { companyName: "", country: "", postalCode: "", address: "", gst: undefined };
  }
};
